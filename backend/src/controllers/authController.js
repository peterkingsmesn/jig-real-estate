const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const ErrorCodes = require('../utils/errorCodes');
const jwt = require('jsonwebtoken');

// 로그인
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json(
        errorResponse(
          ErrorCodes.INVALID_CREDENTIALS,
          'Invalid email or password',
          null,
          req.path
        )
      );
    }

    if (!user.isActive) {
      return res.status(401).json(
        errorResponse(
          ErrorCodes.UNAUTHORIZED,
          'Account is deactivated',
          null,
          req.path
        )
      );
    }

    // 로그인 시간 업데이트
    user.lastLoginAt = new Date();
    
    // 토큰 생성
    const token = user.generateToken();
    const refreshToken = user.generateRefreshToken();
    
    await user.save();

    const userData = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    res.json(successResponse({
      token,
      refreshToken,
      user: userData,
      expiresIn: 7 * 24 * 60 * 60 * 1000 // 7일 (밀리초)
    }));
  } catch (error) {
    next(error);
  }
};

// 토큰 갱신
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json(
        errorResponse(
          ErrorCodes.UNAUTHORIZED,
          'Refresh token is required',
          null,
          req.path
        )
      );
    }

    // 토큰 검증
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // 사용자 찾기
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json(
        errorResponse(
          ErrorCodes.UNAUTHORIZED,
          'Invalid refresh token',
          null,
          req.path
        )
      );
    }

    // refresh token이 DB에 있는지 확인
    const tokenExists = user.refreshTokens.some(
      tokenObj => tokenObj.token === refreshToken
    );

    if (!tokenExists) {
      return res.status(401).json(
        errorResponse(
          ErrorCodes.UNAUTHORIZED,
          'Invalid refresh token',
          null,
          req.path
        )
      );
    }

    // 새 access token 생성
    const newToken = user.generateToken();
    
    // 오래된 refresh token 정리
    await user.cleanExpiredRefreshTokens();

    res.json(successResponse({
      token: newToken,
      expiresIn: 7 * 24 * 60 * 60 * 1000 // 7일 (밀리초)
    }));
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json(
        errorResponse(
          ErrorCodes.TOKEN_EXPIRED,
          'Refresh token expired',
          null,
          req.path
        )
      );
    }
    next(error);
  }
};

// 로그아웃
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      const user = await User.findById(req.user.id);
      user.refreshTokens = user.refreshTokens.filter(
        tokenObj => tokenObj.token !== refreshToken
      );
      await user.save();
    }

    res.json(successResponse(null, 'Logged out successfully'));
  } catch (error) {
    next(error);
  }
};

// 현재 사용자 정보
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password -refreshTokens');
    res.json(successResponse(user));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  refreshToken,
  logout,
  getMe
};